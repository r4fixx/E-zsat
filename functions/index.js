
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v4');
const fbAdmin = require('firebase-admin');
const nodemailer = require('nodemailer');


exports.sendMail = functions.https.onRequest((request, responde) => { });

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'ezsat-b3013'
});

// var serviceAccount = require("path/to/ezsat-b3013-firebase-adminsdk-ri94t-71c258f147.json");

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert({
    "type": "service_account",
    "project_id": "ezsat-b3013",
    "private_key_id": "71c258f147124e2c2d7cbb2b648b66f026a93175",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7FyC7SPpbAVch\nir/kSVF8h2dU1ub977IriHv7MPml0kL/Jh6tVN9hVUR3f/cqbq1XxI/WjPxESZKu\n50XxPggcFZnPPKZvdX7yPNafo8Ia/OnbnZhHtPG/Nxj83XOaTaZ61fLTByCmOsN1\nWyY5nsvr0EEHtplTvxptfyxaxSwdw5Bf0WiTqX328I0PsdS1fX0Tw7M4z1bdNIb/\nFABEMs8kJewqkyEAulSAsIR98IGE5bGGFda5pbd7OlEMn29fQzsdlcrC2c4NUu3R\n2jLVirP8qslw+lTILGoBlI75pTod+9UYo5AQ78DqB4oASobK2w/aBoof596l+j5X\nr0JQzrMHAgMBAAECggEAQ9RsRQp93h27ycjkrm8YkIYE5CDv6XQMTDU1AgqtED4N\nlTTsXVpOjJrd8ldeNK+gwBffMGG4Gkf0Wt41oPOk/A2m0JhEHVfjeQ6un30/JAq6\n/KkD60eCeBmRQShGv9RUPeewnGrSnwHiGHu9/ZkBhNLhqNq+dzrraXR4j8Y5quY7\nyseG3z8fyvMP1K9qScNcqIFcBZ8V5xzoqm1f5So19cEcPWcCvbg+Jm15odlVZr6/\nkjBmOLMBKQeqJ4i6g0ZvWw0SP5af1d8R7VgZMa7BvnRKmPf6qhhyz9ygbIbzB392\nEhXe3/e+uX3Upf5VE/YzWCzurcXSqTmIm4CaSkJgkQKBgQDoPo9rPaYrVFiKkhGn\nG4J4JJFymgQJ59mQEnsu5xl1cWHQt/1vQaf5nmLdFwSW69OCoC05Qg3j9yEis9Co\nTmOaNhF8uCMraUZffHIE++XRl5OKJBYvjWku2TjjyNeCjd+mR/4obEULJm0mQV2j\nW5mEl5Y7oJEG/MIp45LXbXIhNwKBgQDOOi+QaVNkBhxxZySIrHprYdKZUwjIgl1P\ncPfXuFKpjTIZ1jM9AA5t4edBY3ljtw8yAdHKfGxAZkhetyiUdaPBRopfdOOUpSur\nKpApZFtZ8WWxjAhQHChHG7cZypcbg/6fh1V0mHVZSsaAxfotd1rveLdPYPH7CZuz\nJsmt7pYksQKBgF6A9oNA9tky3USl46EIRLL2zmi/21zch19k5dNUHrv3g0IXXH1l\nTiD5Hmmw8CEpnUvOOhjOlDBrY4Rnf0S9gTJDRiJmG4mSsRwx24PDrOT4tQTFYnG/\nLUnvAoNOOsPZT2SubvGr/PxoionCl4Pdxj56IJvq3pjlSW0aOaqH0qVJAoGBAMTT\nKdRFgi6D2p+tVmQPYeOdAJgPdOGR8qbAZfuAU3y5Yujf1BVTOXJMWh/BZfjynVEY\nBXehWtv4AvhLDTLsODdeMPC8Kf0Ty2LZA7BNtRZZ27ohsUlsJlD/tbiq7592Ug1F\n6ByY6d8oC96ZlZXRRXwrFaFwIGN9HxpUWcZkYO5xAoGBAKNJzeQ17+cPz8mXV7g2\nwqq02UOdMyt029UQKm6PNrXY5GwGlkXO7dm9YWbwQpCH3VrapgVlWEOFTgm8xvXs\nOeN9Gdiurma9yLgtq6Pm11YMVmf5R5zgVyBUYeXtbZBXO6nS1FT+D2wiZkJaCCdq\nK8PPWnj6HJVVHdUoBWz6ndT8\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ri94t@ezsat-b3013.iam.gserviceaccount.com",
    "client_id": "101627439827743759360",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ri94t%40ezsat-b3013.iam.gserviceaccount.com"
  }
  ),
});

exports.storeImage = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(500).json({ message: 'Not allowed.' });
    }

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({ error: 'Unauthorized!' });
    }

    let idToken;
    idToken = req.headers.authorization.split('Bearer ')[1];

    const busboy = new Busboy({ headers: req.headers });
    let uploadData;
    let oldImagePath;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filePath = path.join(os.tmpdir(), filename);
      uploadData = { filePath: filePath, type: mimetype, name: filename };
      file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('field', (fieldname, value) => {
      oldImagePath = decodeURIComponent(value);
    });

    busboy.on('finish', () => {
      const id = uuid();
      let imagePath = 'images/' + id + '-' + uploadData.name;
      if (oldImagePath) {
        imagePath = oldImagePath;
      }

      return fbAdmin
        .auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
          console.log(uploadData.type);
          return storage
            .bucket('ezsat-b3013.appspot.com')
            .upload(uploadData.filePath, {
              uploadType: 'media',
              destination: imagePath,
              metadata: {
                metadata: {
                  contentType: uploadData.type,
                  firebaseStorageDownloadTokens: id
                }
              }
            });
        })
        .then(() => {
          return res.status(201).json({
            imageUrl:
              'https://firebasestorage.googleapis.com/v0/b/' +
              storage.bucket('ezsat-b3013.appspot.com').name +
              '/o/' +
              encodeURIComponent(imagePath) +
              '?alt=media&token=' +
              id,
            imagePath: imagePath
          });
        })
        .catch(error => {
          console.log(error);
          return res.status(401).json({ error: 'Unauthorized!' });
        });
    });
    return busboy.end(req.rawBody);
  });
});

