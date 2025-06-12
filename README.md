# Decentralized Education Learning Management System

A blockchain-based learning management system built with Clarity smart contracts on the Stacks blockchain.

## Overview

This decentralized education platform leverages blockchain technology to create a transparent, secure, and verifiable learning management system. The system consists of five core smart contracts that handle different aspects of the educational process:

1. **Educational Institution Verification**: Validates and verifies educational institutions on the platform
2. **Course Delivery**: Manages course content, delivery, and access control
3. **Student Progress Tracking**: Records and verifies student learning progress
4. **Assessment Coordination**: Handles assessment creation, submission, and grading
5. **Certification Management**: Issues and verifies educational certifications

## Smart Contracts

### Educational Institution Verification (`educational-institution-verification.clar`)
- Validates and registers educational institutions
- Manages institution reputation and verification status
- Provides verification checks for other contracts

### Course Delivery (`course-delivery.clar`)
- Manages course creation and content
- Controls access to course materials
- Handles instructor assignments and course metadata

### Student Progress (`student-progress.clar`)
- Tracks student enrollment and progress
- Records completion of course modules
- Provides verifiable progress reports

### Assessment Coordination (`assessment-coordination.clar`)
- Manages assessment creation and distribution
- Handles submission of completed assessments
- Coordinates grading and feedback

### Certification Management (`certification-management.clar`)
- Issues verifiable certificates upon course completion
- Manages certificate metadata and verification
- Provides certificate lookup and validation

## Setup and Installation

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) for local development and testing
- Basic understanding of Clarity and Stacks blockchain

### Local Development
1. Clone the repository
