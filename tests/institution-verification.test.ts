import { describe, it, expect, beforeEach } from 'vitest';

// Mock Clarity contract interactions
const mockContracts = {
  institutionVerification: {
    institutions: new Map(),
    institutionCounter: 0,
    contractOwner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  }
};

// Mock transaction sender
let mockTxSender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

// Mock contract functions
const institutionVerification = {
  registerInstitution: (name) => {
    const institutionId = mockContracts.institutionVerification.institutionCounter + 1;
    const key = institutionId;
    
    if (mockContracts.institutionVerification.institutions.has(key)) {
      return { error: 101 }; // ERR_INSTITUTION_EXISTS
    }
    
    mockContracts.institutionVerification.institutions.set(key, {
      name,
      admin: mockTxSender,
      verified: false,
      registrationBlock: 1000
    });
    
    mockContracts.institutionVerification.institutionCounter = institutionId;
    return { success: institutionId };
  },
  
  verifyInstitution: (institutionId) => {
    if (mockTxSender !== mockContracts.institutionVerification.contractOwner) {
      return { error: 100 }; // ERR_UNAUTHORIZED
    }
    
    const institution = mockContracts.institutionVerification.institutions.get(institutionId);
    if (!institution) {
      return { error: 102 }; // ERR_INSTITUTION_NOT_FOUND
    }
    
    if (institution.verified) {
      return { error: 103 }; // ERR_ALREADY_VERIFIED
    }
    
    institution.verified = true;
    mockContracts.institutionVerification.institutions.set(institutionId, institution);
    return { success: true };
  },
  
  getInstitution: (institutionId) => {
    return mockContracts.institutionVerification.institutions.get(institutionId) || null;
  },
  
  isInstitutionVerified: (institutionId) => {
    const institution = mockContracts.institutionVerification.institutions.get(institutionId);
    return institution ? institution.verified : false;
  }
};

describe('Institution Verification Contract', () => {
  beforeEach(() => {
    // Reset mock state
    mockContracts.institutionVerification.institutions.clear();
    mockContracts.institutionVerification.institutionCounter = 0;
    mockTxSender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  });
  
  describe('registerInstitution', () => {
    it('should successfully register a new institution', () => {
      const result = institutionVerification.registerInstitution('Test University');
      
      expect(result.success).toBe(1);
      expect(mockContracts.institutionVerification.institutionCounter).toBe(1);
      
      const institution = institutionVerification.getInstitution(1);
      expect(institution.name).toBe('Test University');
      expect(institution.verified).toBe(false);
      expect(institution.admin).toBe(mockTxSender);
    });
    
    it('should increment institution counter for multiple registrations', () => {
      institutionVerification.registerInstitution('University A');
      const result = institutionVerification.registerInstitution('University B');
      
      expect(result.success).toBe(2);
      expect(mockContracts.institutionVerification.institutionCounter).toBe(2);
    });
  });
  
  describe('verifyInstitution', () => {
    beforeEach(() => {
      institutionVerification.registerInstitution('Test University');
    });
    
    it('should successfully verify an institution by contract owner', () => {
      const result = institutionVerification.verifyInstitution(1);
      
      expect(result.success).toBe(true);
      expect(institutionVerification.isInstitutionVerified(1)).toBe(true);
    });
    
    it('should fail when non-owner tries to verify', () => {
      mockTxSender = 'ST2DIFFERENT_ADDRESS';
      const result = institutionVerification.verifyInstitution(1);
      
      expect(result.error).toBe(100); // ERR_UNAUTHORIZED
    });
    
    it('should fail when institution does not exist', () => {
      const result = institutionVerification.verifyInstitution(999);
      
      expect(result.error).toBe(102); // ERR_INSTITUTION_NOT_FOUND
    });
    
    it('should fail when institution is already verified', () => {
      institutionVerification.verifyInstitution(1);
      const result = institutionVerification.verifyInstitution(1);
      
      expect(result.error).toBe(103); // ERR_ALREADY_VERIFIED
    });
  });
  
  describe('getInstitution', () => {
    it('should return institution details', () => {
      institutionVerification.registerInstitution('Test University');
      const institution = institutionVerification.getInstitution(1);
      
      expect(institution).toBeTruthy();
      expect(institution.name).toBe('Test University');
      expect(institution.verified).toBe(false);
    });
    
    it('should return null for non-existent institution', () => {
      const institution = institutionVerification.getInstitution(999);
      expect(institution).toBeNull();
    });
  });
  
  describe('isInstitutionVerified', () => {
    it('should return false for unverified institution', () => {
      institutionVerification.registerInstitution('Test University');
      expect(institutionVerification.isInstitutionVerified(1)).toBe(false);
    });
    
    it('should return true for verified institution', () => {
      institutionVerification.registerInstitution('Test University');
      institutionVerification.verifyInstitution(1);
      expect(institutionVerification.isInstitutionVerified(1)).toBe(true);
    });
    
    it('should return false for non-existent institution', () => {
      expect(institutionVerification.isInstitutionVerified(999)).toBe(false);
    });
  });
});
