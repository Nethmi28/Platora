import { computeProductionPlan } from '../services/productionService.js';
import * as PlateModel from "../models/plateModel.js";

export async function checkProductionController(req, res) {
  try {
    // ensure your auth middleware sets req.user.customer_profile_id
    const userId = req.user.id;
    console.log("did i get it right?",userId);
    const customerProfileId = await PlateModel.getCustomerId(userId);
    console.log("did i get it finally??????",customerProfileId);
    if (!customerProfileId) {
      return res.status(400).json({ success: false, message: 'Missing customer profile id' });
    }
    const result = await computeProductionPlan(customerProfileId);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

