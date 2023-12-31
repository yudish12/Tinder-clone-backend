import { catchAsync } from "../utils/catchAsync.js";

import { User } from "../models/usermodel.js";
import { match } from "../models/matchmodel.js";


export const getMatches = catchAsync(async(req,res,next)=>{
    const filters = JSON.parse(req.user.filters);

    
    const isAgeMust = filters?.ageMust;
    const isDistanceMust = filters?.distanceMust;
    const age = filters?.ageFilter
    let distanceFilter = filters?.distanceFilter
    console.log(req.user.preference);
    const aggregatePipeline = [{
        $lookup: {
          from: "matchrequests",
          localField: "_id",
          foreignField: "reciever",
          as: "results"
        }
      },{
        $match: {
          "results.sender":{$ne:req._id},
          gender:req.user.preference
        }
      },
    ];

    if(isDistanceMust && filters){
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
        if(!distanceFilter)distanceFilter = 40
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


export const getMatched = catchAsync(async(req,res,next)=>{
    const userid = req.user._id;

    const data = await match.find({users:userid}).populate('users')

    return res.status(200).json({
        message:"matched users fetched succesfully",
        data:data
    })

})


export const unmatch = catchAsync(async(req,res,next)=>{
    const matchId = req.params;
    const data = await match.findByIdAndUpdate(matchId,{status:"unmatched"},{new:true});
    return res.status(200).json({
        message:"unmatched successfully",
        data:data
    })
})