'use strict';

import mongoose from 'mongoose';

var LoanofficerSchema = new mongoose.Schema({
  name: String,
  title: String,
  address: String, 
  directPhone: String,
  mobilePhone: String,
  faxPhone: String,
  email: String,
  facebookUrl: String,
  facebookName: String,
  pictureUrl: String,
  bannerUrl: String,
  LOlicense: String,
  CompanyLicense: String,
  navbarColor: String,
  realtorAppName: String, // One word, url friendly, used to filter, etc
  loanOfficerName: String
});

export default mongoose.model('Loanofficer', LoanofficerSchema);
