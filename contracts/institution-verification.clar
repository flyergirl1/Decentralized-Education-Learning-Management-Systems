;; Educational Institution Verification Contract
;; Manages verification and registration of educational institutions

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INSTITUTION_EXISTS (err u101))
(define-constant ERR_INSTITUTION_NOT_FOUND (err u102))
(define-constant ERR_ALREADY_VERIFIED (err u103))

;; Institution data structure
(define-map institutions
  { institution-id: uint }
  {
    name: (string-ascii 100),
    admin: principal,
    verified: bool,
    registration-block: uint
  }
)

(define-data-var institution-counter uint u0)

;; Register a new institution
(define-public (register-institution (name (string-ascii 100)))
  (let ((institution-id (+ (var-get institution-counter) u1)))
    (asserts! (is-none (map-get? institutions { institution-id: institution-id })) ERR_INSTITUTION_EXISTS)
    (map-set institutions
      { institution-id: institution-id }
      {
        name: name,
        admin: tx-sender,
        verified: false,
        registration-block: block-height
      }
    )
    (var-set institution-counter institution-id)
    (ok institution-id)
  )
)

;; Verify an institution (only contract owner)
(define-public (verify-institution (institution-id uint))
  (let ((institution (unwrap! (map-get? institutions { institution-id: institution-id }) ERR_INSTITUTION_NOT_FOUND)))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (asserts! (not (get verified institution)) ERR_ALREADY_VERIFIED)
    (map-set institutions
      { institution-id: institution-id }
      (merge institution { verified: true })
    )
    (ok true)
  )
)

;; Get institution details
(define-read-only (get-institution (institution-id uint))
  (map-get? institutions { institution-id: institution-id })
)

;; Check if institution is verified
(define-read-only (is-institution-verified (institution-id uint))
  (match (map-get? institutions { institution-id: institution-id })
    institution (get verified institution)
    false
  )
)

;; Get current institution counter
(define-read-only (get-institution-counter)
  (var-get institution-counter)
)
