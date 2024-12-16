pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                npm install
            }
        }
        stage('Test') {
            steps {
                npx playwright test --project='chrome'
            }
        }
        stage('Archive report'){
          zip zipFile: "playwright-report.zip", archive: true, dir: 'playwright-report'
        }
    }
}
