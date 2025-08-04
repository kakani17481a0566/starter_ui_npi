// const apiEndpoint = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

// export default async function generateImage(prompt, apiKey) {
//   try {
//     const response = await fetch(apiEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       },
//       body: JSON.stringify({
//         text_prompts: [{ text: prompt }],
//         cfg_scale: 7,
//         height: 1024,
//         width: 1024,
//         samples: 1,
//         steps: 30,
//         style_preset: "comic-book"
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`API error: ${response.statusText}`);
//     }

//     const data = await response.json();

//     // Assuming the image is returned as a base64 string
//     const base64Image = data.artifacts[0]?.base64;
//     if (!base64Image) {
//       throw new Error("No image returned from API");
//     }

//     return `data:image/png;base64,${base64Image}`;
//   } catch (error) {
//     throw new Error(`Image generation failed: ${error.message}`);
//   }
// }