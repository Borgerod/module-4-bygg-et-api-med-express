/*
To Remove css-import-error in layout:
Cannot find module or type declarations for side-effect import of './globals.css'.
*/
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
