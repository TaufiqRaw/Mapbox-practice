import {RequestHandler, Request, Response, NextFunction} from 'express';

const catchAsync = (fn: RequestHandler) => (req:Request, res:Response, next:NextFunction) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next)
}

export default catchAsync;