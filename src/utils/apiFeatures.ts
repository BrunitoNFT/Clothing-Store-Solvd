import { Document, Query } from "mongoose";
import { QueryStringParameters } from "../types";

class APIFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: QueryStringParameters;
  limit?: number;
  page?: number;

  constructor(query: Query<T[], T>, queryString: QueryStringParameters) {
    this.query = query;
    this.queryString = queryString;
  }

  async totalDocuments(): Promise<number> {
    // We clone the query here to execute a separate countDocuments query
    // without the applied pagination (limit and skip)
    const countQuery = this.query.clone().skip(0).limit(undefined);
    return await countQuery.countDocuments();
  }
  filter(): APIFeatures<T> {
    const queryObj = { ...this.queryString };
    const excludedFields: string[] = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(): APIFeatures<T> {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields(): APIFeatures<T> {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate(): APIFeatures<T> {
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
export default APIFeatures;
