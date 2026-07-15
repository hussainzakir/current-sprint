// load the shared library and create an instance of BuildFunctions
@Library ( 'jenkins-shared-libraries' ) import com.trinet.ui.BuildFunctions
def builder = new BuildFunctions()
// the following values are provided as Global Jenkins properties
echo "env.HOURS_BEFORE_CLEANUP = ${env.HOURS_BEFORE_CLEANUP}"
echo "env.SONARQUBE_ENV = ${env.SONARQUBE_ENV}"
echo "env.MAVEN_REPOSITORY = ${env.MAVEN_REPOSITORY}"
echo "env.DOCKER_REGISTRY = ${env.DOCKER_REGISTRY}"
echo "env.K8S_API_URL = ${env.K8S_API_URL}"
echo "env.K8S_CLUSTER_NAME = ${env.K8S_CLUSTER_NAME}" 
echo "env.K8S_INGRESS_URL_BASE = ${env.K8S_INGRESS_URL_BASE}"

// possibly override the target K8S cluster for this build
node {
  withFolderProperties {
    if (env.K8S_CLUSTER_NAME_FOLDER) {
      env.K8S_CLUSTER_NAME = env.K8S_CLUSTER_NAME_FOLDER
    }
  }
}
echo "possibly updated env.K8S_CLUSTER_NAME = ${env.K8S_CLUSTER_NAME}" 
// Unique label for the build node in kubernetes
def nodeLabel = "ui-build-${UUID.randomUUID().toString()}"
    builder.buildInKubernetes(label: nodeLabel, cloud: env.K8S_CLUSTER_NAME) {
    def scmVars
    env.DOCKER_IMAGE_TAG = env.BUILD_TAG.replace("%2F", "-")
  node(nodeLabel) {
 properties([disableConcurrentBuilds(),disableResume()]) 
   withFolderProperties {
      // the following values need to be defined as Folder Properties
      echo "UI_APP_NAME = $UI_APP_NAME"
      echo "K8S_SERVICE_ACCOUNT_CREDENTIAL = $K8S_SERVICE_ACCOUNT_CREDENTIAL"
      echo "BASE_ENVIRONMENT = $BASE_ENVIRONMENT"
      echo "K8S_NAMESPACE = $K8S_NAMESPACE"
      echo "AUTH_COOKIE_NAME = $AUTH_COOKIE_NAME"
      echo "ENDPOINT_UNAUTHENTICATED = $ENDPOINT_UNAUTHENTICATED"
      echo "K8S_DEPLOYMENT = $K8S_DEPLOYMENT"
    
    //Clean workspace
    stage('Clean workspace') {
        deleteDir()
        echo"cleaned workspace" 
    }
    //Clone source code
    stage('Clone source code') {
          scmVars = checkout scm
          echo "$scmVars"
    }
    // generate URLs
    generatedURLs = builder.generateURLs(k8sNamespace: K8S_NAMESPACE, k8sIngressURLBase: K8S_INGRESS_URL_BASE, endpointUnauthenticated: ENDPOINT_UNAUTHENTICATED)
    //check package.json
    builder.PreBuildCheck(mavenRepository: env.MAVEN_REPOSITORY)
    //Building
    builder.Build(mavenRepository: env.MAVEN_REPOSITORY)
    //unit tests
    builder.unitTests(mavenRepository: env.MAVEN_REPOSITORY)    
    //SonarQube Analysis
    builder.sonarQubeAnalysis(environment: SONARQUBE_ENV, gitBranch: scmVars.GIT_BRANCH, mavenRepository: env.MAVEN_REPOSITORY)
    //Update version
    builder.updateVersion(mavenRepository: env.MAVEN_REPOSITORY, gitCommit: scmVars.GIT_COMMIT)
    // Upload to Artifactory
    builder.uploadWarToArtifactory(mavenRepository: env.MAVEN_REPOSITORY)
    // create and push docker image
    builder.buildTagPushDocker(dockerRegistry: env.DOCKER_REGISTRY, dockerImageName: UI_APP_NAME, dockerImageTag: env.DOCKER_IMAGE_TAG)
    def filesForConfigMap = []
    def yamlFiles = []
    // prepare deployment and configuration files
    stage('Render Config and Deployment Files') {
        yamlFiles = builder.renderKubernetesTemplates(urls: generatedURLs)
        def slmConfigFilesForConfigMap = builder.renderSLMConfigFiles(urls: generatedURLs)
      }
    // apply to kubernetes
    builder.applyToKubernetes(
        filesForConfigMap: filesForConfigMap, 
        yamlFiles: yamlFiles, 
        k8sNamespace: K8S_NAMESPACE, 
        urls: generatedURLs,
        k8sServiceAccountCredId: K8S_SERVICE_ACCOUNT_CREDENTIAL)
        
        // ui code checkout step 
     builder.uiAutomationTests( 
        urls: generatedURLs,
     			mavenRepository: env.MAVEN_REPOSITORY,
     			repo: env.testAutomationRepo,
     			branch: env.testAutomationBranch,
     			baseEnv: env.BASE_ENVIRONMENT,
     			includedGroups: env.includedGroups,
     			dbCredentialId: env.DB_CREDENTIAL,
     			testBrowser:env.testBrowser,
     			emailTo: env.mailList)  
     		
    	//UITest is a directory to have UI test code base and results	.Build will be marked pass or fail if P% is matched																										
     builder.thresholdCalulation(expectedPassPercentage: env.expectedPassPercentage, xml: "/testng-results.xml")								
    
    // finishing up the pipeline
    builder.finish(gitUrl: scmVars.GIT_URL,generatedURLs:generatedURLs)
    }
  }
}
