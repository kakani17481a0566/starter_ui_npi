// import  { useState ,useEffect} from "react";
// // import generateImage from "./generateImage"; // adjust path
//  // store securely in env for production

// export default function  ImageGenerator (){
//   // const [prompt] = useState("");
//   const [imageSrc, setImageSrc] = useState("");
//   const [ setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const apiKey = "sk-wS79i3czs73KcyFSgfh4YAyKM5Sv0GjgRbyKptPfoTqaZ1Qb";

//  useEffect(() => {
//     const generateImage = async () => {
//       setLoading(true);
//       setErrorMsg('');
//       const prompt = "Generate an apple image with red colour";
//       const apiEndpoint = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

//       try {
//         const response = await fetch(apiEndpoint, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${apiKey}`
//           },
//           body: JSON.stringify({
//             text_prompts: [{ text: prompt }],
//             cfg_scale: 7,
//             height: 1024,
//             width: 1024,
//             samples: 1,
//             steps: 30,
//             style_preset: "comic-book"
//           }),
//         });

//         if (!response.ok) {
//           throw new Error(`API error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const base64Image = data.artifacts?.[0]?.base64;

//         if (base64Image) {
//           setImageSrc(`data:image/png;base64,${base64Image}`);
//         } else {
//           throw new Error("No image data received.");
//         }
//       } catch (error) {
//         setErrorMsg(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     generateImage();
//   }, [apiKey]); 
//   return (
//     <div>
//       <h2>Generate Comic-Style Image</h2>
//       {/* {/* <input
//         type="text"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt"
//       /> */}
//       {/* <button onClick={handleGenerate} disabled={loading || !prompt}>
//      {loading ? "Generating..." : "Generate Image"}
//       </button>  */}

//       {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

//       {imageSrc && (
//         <div>
//           <h4>Generated Image:</h4>
//           <img src={imageSrc} alt="Generated ai image" style={{ maxWidth: "100%" }} />
//         </div>
//       )}
      
//     </div>
//   );
// }

