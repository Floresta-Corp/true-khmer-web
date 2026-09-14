import { myBlogImagePresignAction } from "../services/my-blog-image-presign.action";
import { myBlogMethodNotAllowedLoader } from "../services/my-blog-resource.loader";

export const action = myBlogImagePresignAction;
export const loader = myBlogMethodNotAllowedLoader;
