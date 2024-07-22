export interface ipInfo {
  ip: string;
  location: {
    country: string;
    region: string;
    city: string;
    lat: number;
    lgn: number;
    postalCode: string;
    timezone: string;
  };
  isp: string;
}
