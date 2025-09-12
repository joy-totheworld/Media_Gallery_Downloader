import '@/app/App.css'
import Box from "@mui/material/Box";
import InputUrl from "@/components/InputUrl"
import PreviewGallery from "@/components/PreviewGallery"
import HowTo from "@/components/HowTo"
import ResponsiveSpacer from "@/components/ResponsiveSpacer";

function App() {
  return (
    <Box className="App">
      <HowTo />
      <ResponsiveSpacer smaller='40px' larger='80px' />
      <InputUrl />
      <ResponsiveSpacer smaller='40px' larger='80px' />
      <PreviewGallery />
    </Box>
  )
}

export default App

// fetch("https://kaltura.oregonstate.edu/media/t/1_8all14a9/373511952", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "accept-language": "en-US,en;q=0.9",
//     "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "iframe",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-storage-access": "active",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "x-proctorio": "1.5.25178.21",
//     "cookie": "kms-locale=d2l; _hjSessionUser_1260596=eyJpZCI6IjRlYTBlNWU4LWRmNGEtNTU2YS04YjQzLTE4ZTc3YjVjN2IyMyIsImNyZWF0ZWQiOjE3NTU3Mjg1Mzk3NjksImV4aXN0aW5nIjpmYWxzZX0=; kms_ctamuls=9df96mptqmrv54v5uhp6b8vh5u; testing=; __cf_bm=ZtImxpPDv6uIdtvqJNp3ghmEa00C4FZc8Z_3.KhAclY-1757670833-1.0.1.1-e38AlbyibQlEfLuKgAgz.qW0T.2u0Rdq_P6mPUZtxK68oApN6P3CzW1zhYHhN0YdYlDUwOuCiw1cBLRgP03YTbFRdDc3qtcw17_7wZ3R4E8",
//     "Referer": "https://kaltura.oregonstate.edu/channel/2012570"
//   },
//   "body": null,
//   "method": "GET"
// });

// fetch("https://kaltura.oregonstate.edu/channel/2012570", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "accept-language": "en-US,en;q=0.9",
//     "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "iframe",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "cross-site",
//     "sec-fetch-storage-access": "active",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "x-proctorio": "1.5.25178.21"
//   },
//   "referrer": "http://localhost:5173/",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });