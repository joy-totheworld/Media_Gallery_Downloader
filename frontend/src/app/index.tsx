import React, { useEffect, useState, useRef } from 'react'
import Box from "@mui/material/Box";
import InputUrl from "@/components/InputText"
import PreviewGallery from "@/components/PreviewGallery"
import HowTo from "@/components/HowTo"
import ResponsiveSpacer from "@/components/ResponsiveSpacer";
import { useVideo } from "@/context/VideoContext"
import { callBackendForCourseLinks, callBackendForFlavoredCourseM3u8, callBackendForMp4SequentialBatch, extractCourseNumber } from "@/utils/helpers"
import { Snackbar, Alert } from '@mui/material';
import { callBackendForGenericCourseM3u8 } from "@/utils/helpers"
import type { MediaGalleryData } from "@/utils/helpers"

function App() {

  // consts for error snackbar
  const [open, setOpen] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const handleClose = () => {
    setOpen(false);
  };

  // refs to prevent inf reloads on useEffects
  const scrapingEffectBlock = useRef(false);
  const processingEffectBlock = useRef(false);
  const segsLinksPopulated = useRef(false);

  // state to trigger component reloads
  const [reloadKey, setReloadKey] = useState(0);

  // submitFunction for course number
  const { updateFunction, currCourseNumberLoaded, currCourseNumberString } = useVideo();
  const submitCourseNumber = (inputString: string) => {
    var courseNumberString = extractCourseNumber(inputString)
    if (courseNumberString != null) {
      setReloadKey(reloadKey + 1)
      updateFunction(courseNumberString);
      updateFunction(true);
      console.log(courseNumberString)
    } else {
      setErrorText('Expected URL in the following format: https://canvas.oregonstate.edu/courses/{CourseNumber}.')
      setOpen(true);
    }
  };

  // submitFunction for cookie
  const [cookie, setCookie] = React.useState<string>("");
  const submitCookie = (inputCookie: string) => {
    if (inputCookie != null) {
      setCookie(inputCookie)
    } else {
      setErrorText('No cookie provided.')
      setOpen(true);
    }
  };


  // effect to get kaltura html
  const [videoLinks, setVideoLinks] = useState<string | MediaGalleryData>('');
  useEffect(() => {
    if (currCourseNumberLoaded && cookie != "") {
      callBackendForCourseLinks(currCourseNumberString, cookie)
        .then(data => {
          setVideoLinks(data);
        })
        .catch(error => {
          console.error('Error fetching links:', error);
        });
    }
  }, [currCourseNumberLoaded, cookie]);

  useEffect(() => {
    if (!scrapingEffectBlock.current && typeof videoLinks !== 'string' && videoLinks?.links?.length > 0) {
      scrapingEffectBlock.current = true
      const fetchFlavoredUrls = async () => {
        try {
          const updatedLinks = await Promise.all(
            videoLinks.links.map(async (item) => {
              const flavoredUrl = await callBackendForGenericCourseM3u8(
                item.entryId,
                videoLinks.partnerId,
                videoLinks.ks,
                cookie
              );

              const segLinks = await callBackendForFlavoredCourseM3u8(flavoredUrl, cookie)
              if (typeof segLinks != 'string') {
                return { ...item, flavoredUrl, segLinks };
              } else {
                return { ...item, flavoredUrl };
              }

            })
          );

          setVideoLinks({
            partnerId: videoLinks.partnerId,
            ks: videoLinks.ks,
            links: updatedLinks
          });

          console.log('Updated links with flavoredUrl:', updatedLinks);
          segsLinksPopulated.current = true;
        } catch (error) {
          console.error('Error updating flavoredUrl:', error);
        }
      };

      fetchFlavoredUrls();
    }
  }, [videoLinks]);

  useEffect(() => {
    if (segsLinksPopulated.current && !processingEffectBlock.current && typeof videoLinks !== 'string' && videoLinks?.links?.length > 0) {
      processingEffectBlock.current = true
      const fetchMp4Urls = async () => {
        try {
          const updatedVideoLinksMp4 = await callBackendForMp4SequentialBatch(videoLinks.links)
          setVideoLinks({
            partnerId: videoLinks.partnerId,
            ks: videoLinks.ks,
            links: updatedVideoLinksMp4
          });

          console.log('Updated links with mp4:', updatedVideoLinksMp4);
        } catch (error) {
          console.error('Error updating flavoredUrl:', error);
        }
      }

      fetchMp4Urls();
    }

  }, [segsLinksPopulated.current]);

  return (
    <Box className="App">
      <HowTo />
      <ResponsiveSpacer smaller='40px' larger='80px' />
      <InputUrl buttonLabel='Load Kaltura Page' inputLabel='Canvas Course Page URL:' submitInput={submitCourseNumber} />
      {currCourseNumberLoaded && (
        <InputUrl buttonLabel='Get MP4 Files' inputLabel='Kaltura Request Cookie:' submitInput={submitCookie} />
      )}
      <ResponsiveSpacer smaller='40px' larger='80px' />
      <PreviewGallery reloadKey={reloadKey} />
      {/* <Box>{m3u8Array}</Box> */}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <Alert severity="error" onClose={handleClose}>
          {errorText}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default App