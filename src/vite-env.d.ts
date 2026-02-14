/// <reference types="vite/client" />

declare module "*.png";
declare module "*.svg";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

declare module "figma:asset/*" {
    const content: string;
    export default content;
}
