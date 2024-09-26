export interface CustomMenuItem {
  id?: string;
  title: string;
  routerLink?: string;
  icon?: string;
  subMenu?: CustomMenuItem[];
}
