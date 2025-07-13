import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

export default function CloudinaryBg({
  publicId = "nx7slzy4lrunswsudfet_psange",
  width = 1920,
  height = 1080,
  className = "absolute inset-0 w-full h-screen object-cover z-0",
}) {
  const cld = new Cloudinary({ cloud: { cloudName: "dgqkciyc6" } });

  const img = cld
    .image(publicId)
    .format("auto")
    .quality("auto")
    .resize(fill().width(width).height(height).gravity(autoGravity()));

  return <AdvancedImage cldImg={img} className={className} />;
}
