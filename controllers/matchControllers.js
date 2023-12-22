import { catchAsync } from "../utils/catchAsync.js";

import { User } from "../models/usermodel.js";


export const getMatches = catchAsync(async(req,res,next)=>{
    const filters = JSON.parse(req.user.filters);

    const isAgeMust = filters.ageMust;
    const isDistanceMust = filters.distanceMust;
    const age = filters.ageFilter
    const distanceFilter = filters.distanceFilter

    const aggregatePipeline = [{
        $lookup: {
          from: "matchrequests",
          localField: "_id",
          foreignField: "reciever",
          as: "results"
        }
      },{
        $match: {
          "results.0":{$exists:false}
        }
      }];

    if(isDistanceMust){
        const userLocation = [req.user.location.coordinates[0], req.user.location.coordinates[1]]; // User's location coordinates

        aggregatePipeline.push({
            $match: {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            userLocation,
                            distanceFilter / 6371
                        ]
                    }
                }
            }
        });
    }else{
        const userLocation = [req.user.location.coordinates[0], req.user.location.coordinates[1]];
        aggregatePipeline.push({
            $match: {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            userLocation,
                            distanceFilter / 6371
                        ]
                    }
                }
            }
        });
    }

    if(isAgeMust){
        aggregatePipeline.push({ $match: { age: age } });
    }else{
        aggregatePipeline.push({ $sort: { age: 1 } });
        aggregatePipeline.push({
            $addFields: {
                agePriority: {
                    $cond: {
                        if: { $eq: ['$age', 18] },
                        then: 0,
                        else: 1
                    }
                }
            }
        });
        aggregatePipeline.push({ $sort: { agePriority: 1 } });
    }
    
    const result = await User.aggregate(aggregatePipeline).exec()
    return res.status(200).json({
        message:"success",
        data:result
    })
})