<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# Book Narrator: Text-to-Speech Web Application
## Technical Workflow & Architecture

### Technology Stack Overview

| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | React.js | Component-based architecture, efficient rendering with Virtual DOM, robust ecosystem |
| State Management | React Hooks (useState) | Simple state management without Redux overhead for this scale |
| API Communication | Axios | Promise-based HTTP client with automatic JSON transformation and error handling |
| Styling | Tailwind CSS | Utility-first approach for rapid UI development, responsive design, dark/light mode support |
| Backend | AWS Lambda | Serverless compute, automatic scaling, pay-per-use pricing model |
| API Layer | AWS API Gateway | RESTful API interface, request validation, throttling capabilities |
| Storage | AWS S3 | Scalable object storage for hosting frontend assets and audio files |
| Text-to-Speech | Amazon Polly | High-quality natural-sounding voices in multiple languages |

### Detailed Workflow Architecture

#### 1. Frontend Implementation (React.js)

**Component Structure:**
- `App.js` - Main component handling core functionality and state management
- State hooks:
  - `text` - Stores user input text
  - `voice` - Selected voice identifier
  - `audioUrl` - URL of generated audio
  - `loading` - Boolean indicating processing state
  - `error` - Error message state
  - `isDarkMode` - UI theme preference
  - `characterCount` - Length of entered text

**Key Frontend Features:**
- Responsive design with Tailwind CSS utility classes
- Dark/light mode toggle with persistent state
- Character count validation (3000 character limit)
- Real-time input validation
- Loading state visualization with animated spinner
- Error handling with visual feedback
- Voice selection menu with multiple language options
- Direct audio playback in browser
- Download capability for generated audio files

#### 2. API Communication Layer

**Request Flow:**
1. User enters text in the textarea and selects a voice
2. User initiates generation via "Generate Audio" button
3. Frontend validates input:
   ```javascript
   if (!text.trim()) {
     setError('Please enter some text to narrate');
     return;
   }
   ```
4. Sets loading state: `setLoading(true)`
5. Makes asynchronous POST request to API Gateway endpoint using Axios:
   ```javascript
   const response = await axios.post(
     'https://hccnofpsj9.execute-api.us-east-2.amazonaws.com/prod/generate-audio',
     { text, voice_id: voice },
     { headers: { 'Content-Type': 'application/json' } }
   );
   ```
6. Handles response: `setAudioUrl(response.data.audio_url)`
7. Handles errors via try/catch block with appropriate user feedback
8. Resets loading state: `setLoading(false)`

#### 3. Backend Implementation (AWS Lambda)

**Lambda Function Configuration:**
- Runtime: Node.js 14.x
- Memory: 256MB
- Timeout: 30 seconds
- Execution role: S3 write access, Polly full access
- Environment variables:
  - `S3_BUCKET`: Storage bucket name
  - `REGION`: AWS region (us-east-2)

**Lambda Function Workflow:**
1. Receives request from API Gateway with text and voice_id parameters
2. Validates input parameters
3. Initializes AWS SDK clients:
   ```javascript
   const AWS = require('aws-sdk');
   const polly = new AWS.Polly();
   const s3 = new AWS.S3();
   ```
4. Sends text to Amazon Polly with specified voice:
   ```javascript
   const pollyParams = {
     Text: text,
     OutputFormat: 'mp3',
     VoiceId: voice_id
   };
   const pollyResponse = await polly.synthesizeSpeech(pollyParams).promise();
   ```
5. Generates unique filename using timestamp and random string
6. Uploads audio buffer to S3:
   ```javascript
   const s3Params = {
     Bucket: process.env.S3_BUCKET,
     Key: `narrations/${filename}.mp3`,
     Body: pollyResponse.AudioStream,
     ContentType: 'audio/mpeg'
   };
   await s3.putObject(s3Params).promise();
   ```
7. Generates pre-signed URL for client download:
   ```javascript
   const url = s3.getSignedUrl('getObject', {
     Bucket: process.env.S3_BUCKET,
     Key: `narrations/${filename}.mp3`,
     Expires: 3600 // URL valid for 1 hour
   });
   ```
8. Returns audio URL in Lambda response

#### 4. API Gateway Configuration

**API Gateway Setup:**
- REST API with CORS enabled
- Resource: `/generate-audio`
- Method: POST
- Integration: Lambda proxy
- Request validation:
  - Required request body
  - Content type: application/json
- Request model:
  ```json
  {
    "type": "object",
    "required": ["text", "voice_id"],
    "properties": {
      "text": {"type": "string", "maxLength": 3000},
      "voice_id": {"type": "string"}
    }
  }
  ```
- Usage plan: Rate limiting (100 requests per minute)
- API key for authentication

#### 5. Storage Architecture (S3)

**S3 Bucket Configuration:**
- Bucket policy: Restricted access via IAM
- CORS enabled for frontend domain
- Lifecycle rules: Delete narrations older than 7 days
- Organization structure:
  - `/frontend/` - React application static assets
  - `/narrations/` - Generated audio files

**Frontend Hosting:**
- S3 static website hosting enabled
- CloudFront distribution for caching and HTTPS
- DNS record in Route 53 for custom domain

### Advantages of the Architecture

1. **Serverless Benefits:**
   - No server maintenance overhead
   - Automatic scaling from 0 to thousands of requests
   - Cost efficiency (pay only for actual usage)
   - High availability across multiple AWS availability zones

2. **React.js Benefits:**
   - Component reusability for maintainable codebase
   - Virtual DOM for efficient UI updates
   - Declarative programming model
   - Rich ecosystem of libraries and tools

3. **AWS Integration Benefits:**
   - Seamless integration between services
   - Managed security with IAM roles
   - Monitoring via CloudWatch
   - Global content delivery via CloudFront

### Scalability Considerations

- **Lambda Concurrency:** Auto-scales to handle traffic spikes
- **S3 Performance:** Practically unlimited storage, high throughput
- **API Gateway Scaling:** Throttling to prevent abuse
- **Cost Control:** Usage monitoring and budget alerts

### Security Measures

- **API Access:** API keys and IAM roles
- **Data in Transit:** HTTPS for all communications
- **Data at Rest:** S3 server-side encryption
- **Input Validation:** At both frontend and API Gateway levels
- **CORS Configuration:** Restricting cross-origin requests

### Future Enhancements

1. **User Authentication:**
   - Amazon Cognito for user management
   - Personal libraries of saved narrations

2. **Advanced Voice Options:**
   - SSML support for fine-tuned speech
   - Neural voices for more natural sound

3. **Processing Large Documents:**
   - Async processing via SQS/SNS
   - Progress indicators for long texts

4. **Analytics:**
   - Usage metrics via CloudWatch
   - Conversion tracking
>>>>>>> 863c998b39d60eed64af5c3c03d86184d89cfb7d
