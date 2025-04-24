# CryptoBallot Frontend

A React single-page application for the CryptoBallot voting system.  
Allows users to register, authenticate, cast encrypted votes (plain or blind-signed), view live results, and simulate security attacks.

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Configuration](#configuration)  
4. [Running the App](#running-the-app)  
5. [Project Structure](#project-structure)  
6. [System Architecture & Workflows](#system-architecture-and-workflows)
7. [Pages & Features](#pages--features)  
   - [Home](#1-home)  
   - [Authentication](#2-authentication)  
   - [Blind Signature Demo](#3-blind-signature-demo)  
   - [Aggregation Demo](#4-aggregation-demo)  
   - [Cast Vote](#5-cast-vote)  
   - [Vote with Signature](#6-vote-with-signature)  
   - [Results Tally](#7-results-tally)  
   - [Live Attack Analysis](#8-live-attack-analysis)  

---

## Prerequisites

- **Node.js** v16 or higher  
- **npm** v8 or higher (or **Yarn**)

Verify installation:
```bash
node -v
npm -v
```
## Installation
Clone the repository

```
git clone https://github.com/your-org/cryptoballot-frontend.git
cd cryptoballot-frontend
```

Install dependencies
```
npm install
# or
yarn install
```

## Configuration
Edit **src/config.js** if your backend API is hosted elsewhere:
```
export const API_BASE_URL = 'http://localhost:8080'
```

## Running the App
```
npm start
# or
yarn start
```
Open your browser at http://localhost:3000.

## Project Structure

![image](https://github.com/user-attachments/assets/c4dbcee8-c0e4-4cb0-bb9a-9b14991714e1)


## System Architecture and Workflows

- High Level Diagram how defferent layers connected in my Application

![Screenshot 2025-04-22 101753](https://github.com/user-attachments/assets/0ea23dcf-0cd9-4139-84e8-581fb75ff7ee)

- Key Management persistence and Activeness throughout the entire session of Application

![Screenshot 2025-04-22 102146](https://github.com/user-attachments/assets/72f0a293-f7bb-4d8c-bae9-d04a8c6c2250)

- Different Workflows in an overview for casting vote:

1. Casting vote [Paillier Encryption] Without Blind Sgnature
![Screenshot 2025-04-22 102029](https://github.com/user-attachments/assets/db0ba013-41cd-4aeb-a3b5-067a75120a57)
2. Casting vote [Paillier Encryption] With Blind Sgnature
![Screenshot 2025-04-22 102105](https://github.com/user-attachments/assets/2d69a800-67a1-4c36-8b0d-dddfe49dc611)

## Pages & Features

1. Home
A welcome page describing CryptoBallot and navigation.

3. Authentication
Register new voters or log in (username & password).

4. Blind Signature Demo
Demonstrates RSA blind-signature steps on a numeric message.

5. Aggregation Demo
Encrypt values, aggregate them homomorphically, and decrypt the sum.

6. Cast Vote
Encrypt your vote value and submit with a plaintext candidate.

7. Vote with Signature
Full flow: encrypt, blind, sign, unblind, and cast.

8. Results Tally
View system-wide totals and decrypt your personal votes.

![Screenshot 2025-04-22 102840](https://github.com/user-attachments/assets/934a694e-97f8-463f-b801-0e9636b771ec)

10. Live Attack Analysis
Simulate replay, substitution, and injection attacks; view logs and charts.

![Screenshot 2025-04-22 102913](https://github.com/user-attachments/assets/143a5c06-d7b6-451e-acf7-897839c3ff98)


## Db Schema Overview

- Need to connect with postgresql where already code configured.
- Just need to add db with name `cryptoballotdb` in default postgres port 

![Screenshot 2025-04-22 104041](https://github.com/user-attachments/assets/21f40114-779c-4b23-8e26-a688769fc5a1)
![Screenshot 2025-04-22 104101](https://github.com/user-attachments/assets/f3090798-8e97-47a7-bd6e-12f00baf854e)


