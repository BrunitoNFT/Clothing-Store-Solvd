"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    totalDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            // We clone the query here to execute a separate countDocuments query
            // without the applied pagination (limit and skip)
            const countQuery = this.query.clone().skip(0).limit(undefined);
            return yield countQuery.countDocuments();
        });
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select("-__v");
        }
        return this;
    }
    paginate() {
        const page = this.queryString.page ? parseInt(this.queryString.page) : 1;
        const limit = this.queryString.limit
            ? parseInt(this.queryString.limit)
            : 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        this.limit = limit;
        this.page = page;
        return this;
    }
}
// Export the class
exports.default = APIFeatures;
