import React, { useEffect, useState, useRef } from 'react'
import { Box, Snackbar, Alert, Backdrop } from '@mui/material';
// import type { CircularProgressProps } from '@mui/material';
import InputUrl from "@/components/InputText"
import PreviewGallery from "@/components/PreviewGallery"
import HowTo from "@/components/HowTo"
import CircularProgressWithLabel from "@/components/CircularProgressWithLabel"
import ResponsiveSpacer from "@/components/ResponsiveSpacer";
import { useVideo } from "@/context/VideoContext"
import { callBackendForCourseLinks, callBackendForFlavoredCourseM3u8, callBackendForMp4SequentialBatch, extractCourseNumber, callBackendForGenericCourseM3u8 } from "@/utils/helpers"
import type { MediaGalleryData } from "@/utils/helpers"

function App() {

  // consts for error snackbar
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // consts for backdrop
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  // state to display progress
  const [linksGenerated, setlinksGenerated] = useState(0);
  const [linksTotal, setlinksTotal] = useState(0);

  // state to trigger component reloads
  const [reloadKey, setReloadKey] = useState(0);

  // refs to prevent inf reloads on useEffects
  const scrapingEffectBlock = useRef(false);
  const processingEffectBlock = useRef(false);
  const segsLinksPopulated = useRef(false);

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
      setOpenSnackbar(true);
    }
  };

  // submitFunction for cookie
  const [cookie, setCookie] = React.useState<string>("");
  const submitCookie = (inputCookie: string) => {
    if (inputCookie != null) {
      setCookie(inputCookie)
      setOpenBackdrop(true)
    } else {
      setErrorText('No cookie provided.')
      setOpenSnackbar(true);
    }
  };


  // effect to get kaltura html
  const [galleryData, setGalleryData] = useState<string | MediaGalleryData>('');
  useEffect(() => {
    if (currCourseNumberLoaded && cookie != "") {
      callBackendForCourseLinks(currCourseNumberString, cookie, setlinksTotal)
        .then(data => {
          setGalleryData(data);
        })
        .catch(error => {
          console.error('Error fetching links:', error);
        });
    }
  }, [currCourseNumberLoaded, cookie]);

  useEffect(() => {
    if (!scrapingEffectBlock.current && typeof galleryData !== 'string' && galleryData?.links?.length > 0) {
      scrapingEffectBlock.current = true
      const fetchFlavoredUrls = async () => {
        try {
          const updatedLinks = await Promise.all(
            galleryData.links.map(async (item) => {
              const flavoredUrl = await callBackendForGenericCourseM3u8(
                item.entryId,
                galleryData.partnerId,
                galleryData.ks,
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

          setGalleryData({
            partnerId: galleryData.partnerId,
            ks: galleryData.ks,
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
  }, [galleryData]);

  useEffect(() => {
    if (segsLinksPopulated.current && !processingEffectBlock.current && typeof galleryData !== 'string' && galleryData?.links?.length > 0) {
      processingEffectBlock.current = true
      const fetchMp4Urls = async () => {
        try {
          const updatedVideoLinksMp4 = await callBackendForMp4SequentialBatch(galleryData.links, setlinksGenerated)
          setGalleryData({
            partnerId: galleryData.partnerId,
            ks: galleryData.ks,
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
        open={openSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {errorText}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop && (linksGenerated != linksTotal)}
        onClick={handleCloseBackdrop}
      >
        <CircularProgressWithLabel generated={linksGenerated} total={linksTotal} />
      </Backdrop>
    </Box>
  )
}

export default App