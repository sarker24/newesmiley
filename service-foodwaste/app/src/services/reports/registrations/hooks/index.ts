/* istanbul ignore file */

import { disallow, iff, isProvider } from 'feathers-hooks-common';
import {
  authVerifyToken,
  includeSoftDeletedData,
  populateUserAndCostumer, validateSchema
} from 'feathers-hooks-esmiley';
import * as schemas from 'schemas';

import parseJsonResult from '../../../../hooks/parse-json-result';
import parseDateParams from '../../../../hooks/parse-date-params';
import parseRegistrationPointsParams from '../../../../hooks/parse-registration-points-params';
import parseDimensionParams from '../../../../hooks/parse-dimension-params';
import parseReportAccountParams from '../../../../hooks/parse-report-account-params';

const findRequestSchema = schemas.get('report-find-request');

/**
 * @url /reports/*
 */
export const before = {
  all: [
    iff(isProvider('external'),
      validateSchema(findRequestSchema, { coerceTypes: true }),
      authVerifyToken(),
      populateUserAndCostumer(),
      parseRegistrationPointsParams(),
      parseDateParams(),
      parseDimensionParams(),
      parseReportAccountParams()
    )
  ],
  find: [
    includeSoftDeletedData(),
  ],
  get: [disallow()],
  create: [disallow()],
  update: [disallow()],
  patch: [disallow()],
  remove: [disallow()]
};

export const after = {
  all: [parseJsonResult()],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

export const error = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
