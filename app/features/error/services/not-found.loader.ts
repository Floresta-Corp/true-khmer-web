import { data } from "react-router";

/* The catch-all route renders its page, so the status has to be set here —
   otherwise an unmatched URL answers 200 and search engines index it. */
export function notFoundLoader() {
  return data(null, { status: 404 });
}
