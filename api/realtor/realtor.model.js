'use strict';

import mongoose from 'mongoose';

var RealtorSchema = new mongoose.Schema({
  realtorAppName: String, // One word, url friendly, used to filter, etc
  loanOfficerName: String
  
});

export default mongoose.model('Realtor', RealtorSchema);
