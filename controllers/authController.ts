import { Request, Response } from "express"

const index = (req:Request, res:Response)=>{
    res.send('The api is live')
}









export default {
    index,
}