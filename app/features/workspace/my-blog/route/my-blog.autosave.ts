import { myBlogAutosaveAction } from "../services/my-blog-autosave.action";
import { myBlogMethodNotAllowedLoader } from "../services/my-blog-resource.loader";

export const action = myBlogAutosaveAction;
export const loader = myBlogMethodNotAllowedLoader;
