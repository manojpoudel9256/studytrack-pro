# Screen Transition Diagram – StudyTrack Pro

```mermaid
flowchart TD
    A[Login Screen] -->|Login Success| B[Dashboard]
    A -->|Register| C[Register Screen]
    A -->|Toggle Language| A
    C -->|Register Success| A
    C -->|Toggle Language| C

    B --> D[Create Record Screen]
    B --> E[Record List Screen]
    B --> G[Settings Screen]

    D -->|Save Record| B
    E -->|Edit Record| F[Edit Record Screen]
    F -->|Update| B

    E -->|Delete Record| B
    G -->|Toggle Language| G
    B -->|Logout| A
```