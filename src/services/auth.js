import axios from 'axios'

export const getToken = async () => {
  try {
    const clientId = 'TwLnADX6F27jCpvfGIodNeNsPOAxWz8KypXhkTkyhQXGYrbJ'
    const clientSecret =
      'LLYCw4UHEQ8skMPKAehK1N0ojKrb0GI84RjwdclEXZ0zbICPdxT7BZW65BUQEP6W'

    const formData = new URLSearchParams()
    formData.append('client_id', clientId)
    formData.append('client_secret', clientSecret)

    const response = await axios.post(
      'https://api-satusehat-dev.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const accessToken = response.data.access_token

    // Store the token in Firebase Realtime Database
    await storeTokenInFirebase(accessToken)

    return accessToken
  } catch (error) {
    console.error('Error fetching access token:', error.message)
    throw error // Propagate the error to the calling code
  }
}

const storeTokenInFirebase = async (accessToken) => {
  try {
    // Firebase Realtime Database URL
    const firebaseUrl =
      'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json'

    // Use Axios to store the token in Firebase
    await axios.put(firebaseUrl, { token: accessToken })

    console.log('Token successfully stored in Firebase!')
  } catch (error) {
    console.error('Error storing token in Firebase:', error.message)
    throw error // Propagate the error to the calling code
  }
}