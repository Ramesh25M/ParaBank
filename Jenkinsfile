pipeline {
    agent any
    parameters{
        choice(name: 'BROWSERS', 
        choices:['chrome', 'safari', 'firefox'],
        description: 'Choose the browser'
        )
    }
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                sh "npm install"

            }
        }
        stage('Test') {
            steps {
                sh "npx playwright test --project=${parameters.BROWSERS}"
            }
        }
        // stage('Archive report'){
        //     steps{
        //         zip zipFile: "playwright-report.zip", archive: true, dir: 'playwright-report'
        //     } 
        // }
    }
}
