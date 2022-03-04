export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
}

const data: IMenuItem[] = [
{
  id: 'dashboard',
  icon: 'simple-icon-pie-chart',
  label: 'Dashboard',
  to: '/app/dashboard'
},
{
  id: 'report-generation',
  icon: 'simple-icon-note',
  label: 'report-generation',
  to: '/app/report-generation'
},
{
  id: 'generated-reports',
  icon: 'simple-icon-notebook',
  label: 'generated-reports',
  to: '/app/generated-reports'
},
{
  id: 'map',
  icon: 'simple-icon-globe',
  label: 'Map',
  to: '/app/map'
}
];
export default data;
