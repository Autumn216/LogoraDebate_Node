import { SignatureJWTAuth } from '../SignatureJWTAuth';

describe('SignatureJWTAuth', () => {
	const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

	describe("shouldInitAuth", () => {
		it('should return true if token present', () => {
			const signatureJWTAuth = new SignatureJWTAuth("provider", "token");
			
			expect(signatureJWTAuth.shouldInitAuth()).toBe(true);
		});

		it('should return true if token null', () => {
			const signatureJWTAuth = new SignatureJWTAuth("provider", null);
			
			expect(signatureJWTAuth.shouldInitAuth()).toBe(false);
		});

		it('should return true if token empty', () => {
			const signatureJWTAuth = new SignatureJWTAuth("provider", "");
			
			expect(signatureJWTAuth.shouldInitAuth()).toBe(false);
		});
	});
	
	describe("isSameUser", () => {
		it('should return true if same session id', () => {
			const signatureJWTAuth = new SignatureJWTAuth("provider", jwtToken);
			
			expect(signatureJWTAuth.isSameUser("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")).toBe(true);
		});

		it('should return false if empty token', () => {
			const signatureJWTAuth = new SignatureJWTAuth("provider", null);
			
			expect(signatureJWTAuth.isSameUser("random")).toBe(false);
		});

		it('should return false if wrong signature', () => {
			const signatureJWTAuth = new SignatureJWTAuth("provider", jwtToken);
			
			expect(signatureJWTAuth.isSameUser("random")).toBe(false);
		});
	});

	describe("getAuthorizationParams", () => {
		it('should return correct params', () => {
			const signatureJWTAuth = new SignatureJWTAuth("provider", jwtToken);
			const authorizationParams = signatureJWTAuth.getAuthorizationParams();
			
			expect(authorizationParams.grant_type).toBe("assertion");
			expect(authorizationParams.assertion_type).toBe("signature_jwt");
			expect(authorizationParams.assertion).toBe(jwtToken);
			expect(authorizationParams.session_id).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
		});
	});
});