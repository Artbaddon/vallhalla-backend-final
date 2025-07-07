import { Router } from "express";
import PetController from "../controllers/pet.controller.js";
import { requirePermission, requireOwnership } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/uploads.js"; 

const router = Router();

// Public routes (if any)

// Protected routes
// Admin can see all pets
router.get("/", 
  requirePermission("pets", "read"),
  PetController.show
);

// Create pet
router.post(
  "/",
  requirePermission("pets", "create"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "vaccination_card", maxCount: 1 }
  ]),
  PetController.register
);

// Get my pets
router.get("/my/pets",
  requirePermission("pets", "read"),
  PetController.getMyPets
);

// View specific pet (owners can only see their own)
router.get("/:id",
  requirePermission("pets", "read"),
  requireOwnership("pet"),
  PetController.findById
);

// Update pet (owners can only update their own)
// routes/pets.js o donde tengas tus rutas
router.put(
  "/:id",
  requirePermission("pets", "update"),
  requireOwnership("pet"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "vaccination_card", maxCount: 1 }
  ]),
  PetController.update
);


// Delete pet (owners can only delete their own)
router.delete("/:id",
  requirePermission("pets", "delete"),
  requireOwnership("pet"),
  PetController.delete
);

export default router;