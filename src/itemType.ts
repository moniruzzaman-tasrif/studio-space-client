export interface StudioType{
   title:string,
  selectedCategory:string,
  description:string,
    hourlyRateValue:string,
  securityDepositValue:string,
maxCapacityValue:string
 location:string
 imageUrl:string
}
export interface DataType {
  _id: string;
  title: string;
  category: string;
  description: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  ownerName: string;
  ownerEmail: string;
}
