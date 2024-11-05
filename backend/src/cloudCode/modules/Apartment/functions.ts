import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Company } from "../../models/Company";
import { Contract } from "../../models/Contract";
import { ApartmentStatusCodes } from "../../utils/statusCodesMaps";

Parse.Cloud.define("getApartments", async (request) => {
  const { data, companyId } = request.params;
  const sessionToken = request.user?.getSessionToken();
  if(!companyId){
    throw new Error("Company ID is required");
  }
  const company = new Company();
  company.id = companyId;

  const buildingsQuery = new Parse.Query(Building)
    .equalTo("company", company)
    .equalTo("isArchived", false);

  let query = new Parse.Query(Apartment);
    if (data?.searchValue) {
      const re = RegExp(
        `${data?.searchValue?.replace("+", "\\+").replace("-", "\\-")}`,
        "i"
      );
      const descQuery = new Parse.Query(Apartment).matches("name", re);
      query = Parse.Query.or(descQuery);
    }

    query
      .matchesQuery("building", buildingsQuery)
      .equalTo("isArchived", false)
      
    if (data?.sortField) {
      if (data.sortOrder === -1) {
        query.descending(data.sortField);
      } else {
        query.ascending(data.sortField);
      }
    } else {
      query.ascending("createdAt");
    }
    if (data?.withCount) {
      query.withCount(true);
    }
    if (data?.pageIndex) {
      query.skip(data?.pageIndex);
    }
    if (data?.pageSize) {
      query.limit(data?.pageSize);
    }else{
      query.limit(10000000);
    }
    const contracts = await new Parse.Query(Contract)
    .matchesQuery("apartment", query)
    .find({sessionToken})
    const apartmentsResult :any = await query.find({sessionToken});

    let apartments = apartmentsResult.results || apartmentsResult
    
    const result = apartments.map((apartment:Apartment) =>{
      let EstimatedRentPrice = 0
      const contract = contracts
        .filter(contract => contract.get("apartment").id === apartment.id)
        .sort((a, b) => b.get("startDate") - a.get("startDate"))[0];
      if(contract){
          //paymentFrequency: monthly, Trimonthly,semiannually,annually
        if(contract.get("paymentFrequency") === "Monthly"){
          EstimatedRentPrice = Number(contract.get("rentAmount")) * 12
        }
        else if(contract.get("paymentFrequency") === "Trimonthly"){
          EstimatedRentPrice = Number(contract.get("rentAmount")) * 4
        }
        else if(contract.get("paymentFrequency") === "SemiAnnually"){
          EstimatedRentPrice = Number(contract.get("rentAmount")) * 2
        }
        else if(contract.get("paymentFrequency") === "Annually"){
          EstimatedRentPrice = Number(contract.get("rentAmount"))
        }
      }
      return {apartment, EstimatedRentPrice}
    })
    return {results: result, count: apartmentsResult.count}
});

Parse.Cloud.define("addApartment", async (request) => {
  const sessionToken = request.user?.getSessionToken();
  const { name, floor, size, isFurnished, bedroom, bathroom, rentPrice, imgs, buildingId, number, description, amenities, owner } = request.params;
  const building = new Building();
  building.id = buildingId;
  const apartmentObj = new Apartment();
  apartmentObj.name = name;
  apartmentObj.floor = floor;
  apartmentObj.size = size;
  apartmentObj.isFurnished = isFurnished;
  apartmentObj.status = "vacant";
  apartmentObj.statusCode = ApartmentStatusCodes.Vacant;
  apartmentObj.bedroom = bedroom;
  apartmentObj.bathroom = bathroom;
  apartmentObj.rentPrice = rentPrice;
  if(imgs)
    apartmentObj.imgs = imgs;
  else
    apartmentObj.imgs = [];
  apartmentObj.building = building;
  apartmentObj.isArchived = false;
  apartmentObj.number = number;
  apartmentObj.owner = owner;
  apartmentObj.description = description;
  apartmentObj.amenities = amenities;
  return apartmentObj.save(null, { sessionToken });
});

Parse.Cloud.define("deleteApartment", async (request) => {
  const { apartmentId } = request.params;
  const sessionToken = request.user?.getSessionToken();
  const apartment = new Apartment();
  apartment.id = apartmentId;
  await apartment.fetch({ sessionToken });
  apartment.isArchived = true;
  return apartment.save(null, { sessionToken });
});

Parse.Cloud.define("updateApartment", async (request) => {
  const sessionToken = request.user?.getSessionToken();
  const { apartmentId, name, floor, size, isFurnished, statusCode, bedroom, bathroom, rentPrice, imgs, number, description, amenities, buildingId, owner  } = request.params;
  const apartment = new Apartment();
  apartment.id = apartmentId;
  await apartment.fetch({ sessionToken });
  apartment.name = name;
  apartment.floor = floor;
  apartment.size = size;
  apartment.isFurnished = isFurnished;
  if(Object.keys(ApartmentStatusCodes).includes(statusCode)){
    apartment.statusCode = statusCode;
    apartment.status = ApartmentStatusCodes[statusCode as keyof typeof ApartmentStatusCodes]
  }
  apartment.bedroom = bedroom;
  apartment.bathroom = bathroom;
  apartment.rentPrice = rentPrice;
  if(imgs?.length > 0)
    apartment.imgs = imgs;
  else
    apartment.imgs = [];
  apartment.number = number;
  apartment.owner = owner;
  apartment.description = description;
  apartment.amenities = amenities;
  const building = new Building();
  building.id = buildingId;
  apartment.building = building;
  return apartment.save(null, { sessionToken });
});

// Parse.Cloud.define("getApartmentWithContract", async (request) => {
//   const sessionToken = request.user?.getSessionToken();
//   const company = request.user?.get("company");
//   const buildingQuery = new Parse.Query(Building).equalTo("company", company).equalTo("isArchived", false);
//   const apartmentQuery = await new Parse.Query(Apartment).matchesQuery("building", buildingQuery).equalTo("isArchived", false)
//   const contracts = await new Parse.Query(Contract).matchesQuery("apartment", apartmentQuery)
//   .find({sessionToken});
//   return contracts;
// })
