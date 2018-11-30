<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?

Sessions provide a way to persist data across requests. Persist authentication information so there is no need to re-enter credentials on every new request the client makes to the server.

2. What does bcrypt do to help us store passwords in a secure manner.

password hashing function.
implements salting both manual and automatically.
accumulative hashing rounds.

3. What does bcrypt do to slow down attackers?

Having an algorithm that hashes the information multiple times (rounds) means an attacker needs to have the hash, know the algorithm used, and how many rounds were used to generate the hash in the first place

4. What are the three parts of the JSON Web Token?

The header.
The payload.
The signature.
