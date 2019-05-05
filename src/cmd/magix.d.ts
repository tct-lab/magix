Inc('../tmpl/magix.d');
declare namespace Magix5 {
    interface Magix {
        default: this
    }
}
declare module "magix5" {
    const Magix: Magix5.Magix;
    export = Magix
}