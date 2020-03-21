export const MenuItems: Array<IMenuItems> = [
  {title: 'DEALS SHEET', link: '/deals-overview'}
 /* {title: 'Appointment Details', link: '/appointment-details'},
  {title: 'Review And Submit', link: '/review'}*/
];


export interface IMenuItems {
  title: string;
  link: string;
  imageUrl?: string;
}
