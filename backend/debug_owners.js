import { connect } from "./config/db/connectMysql.js";
import OwnerModel from "./models/owner.model.js";

async function debugOwners() {
  try {
    console.log("=== DEBUG: Owner IDs in Database ===");
    
    // Get all owners
    const owners = await OwnerModel.show();
    console.log("Raw owners from OwnerModel.show():", owners);
    
    // Get owners with details
    const ownersWithDetails = await OwnerModel.getOwnersWithDetails();
    console.log("Owners with details:", ownersWithDetails);
    
    // Check what IDs exist
    const [ownerIds] = await connect.query("SELECT Owner_id FROM owner ORDER BY Owner_id");
    console.log("Owner IDs in database:", ownerIds.map(row => row.Owner_id));
    
    // Check if there are any reservations with invalid owner IDs
    const [reservations] = await connect.query(`
      SELECT r.Owner_FK_ID, COUNT(*) as count 
      FROM reservation r 
      LEFT JOIN owner o ON r.Owner_FK_ID = o.Owner_id 
      WHERE o.Owner_id IS NULL 
      GROUP BY r.Owner_FK_ID
    `);
    
    if (reservations.length > 0) {
      console.log("Found reservations with invalid owner IDs:", reservations);
    } else {
      console.log("All existing reservations have valid owner IDs");
    }
    
    // Check reservation table structure
    const [reservationStructure] = await connect.query("DESCRIBE reservation");
    console.log("Reservation table structure:", reservationStructure);
    
  } catch (error) {
    console.error("Error in debug:", error);
  } finally {
    process.exit(0);
  }
}

debugOwners(); 