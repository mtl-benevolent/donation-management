import { clock } from '../../system/clock/clock';
import { contexts } from '../../system/context/context';
import { DB } from '../../system/db/tables.config';
import { makeFindOneDonation } from './methods/find-one-donation';
import { makeInsertDonation } from './methods/insert-donation';
import { makeInsertDonationEntries } from './methods/insert-donation-entry';

const insertEntries = makeInsertDonationEntries({
  clock,
  getUserInfo: contexts.userInfo.getValue,
  getQueryBuilder: DB.donationEntries.getQueryBuilder,
});

export const DonationRepository = {
  findOne: makeFindOneDonation({
    getQueryBuilder: DB.donations.getQueryBuilder,
  }),
  insertEntries,
  insert: makeInsertDonation({
    clock,
    getUserInfo: contexts.userInfo.getValue,
    getQueryBuilder: DB.donations.getQueryBuilder,
    insertDonationEntries: insertEntries,
  }),
};
