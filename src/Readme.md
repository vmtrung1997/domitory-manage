# Docker deploy

The following guide shows how to install this app with Docker in Ubuntu 18.04

## Installation
-   Open a terminal window. If you don't know how to open a terminal window on
    Ubuntu please read [the answer](https://askubuntu.com/questions/183775/how-do-i-open-a-terminal).

-   Type commands below into the terminal window to install `docker`. More
    instructions can be found [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/).

    ```sh
    sudo apt-get update
    sudo apt-get install -y \
      apt-transport-https \
      ca-certificates \
      curl \
      gnupg-agent \
      software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) \
      stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    ```
-   Install docker-compose (1.19.0 or newer). Compose is a tool for
    defining and running multi-container docker applications.

    ```bash
    sudo apt-get install -y python3-pip
    sudo python3 -m pip install docker-compose
    ```

-   Clone Dormitory management source code from the
    [GitHub repository](https://github.com/vmtrung1997/domitory-manage/tree/deploy_docker) with deploy_docker branch. Note that **deploy_docker** branch is the only specific branch include sources to deploy with Docker. The following scripts show how to get or you can see in [Stack overflow](https://stackoverflow.com/questions/1911109/how-do-i-clone-a-specific-git-branch)

    ```bash
    sudo apt-get install -y git

    git clone -b deploy_docker https://github.com/vmtrung1997/domitory-manage.git

    cd domitory-manage/src
    ```

-   Build docker images by default. It will take some time to download public docker images like node:10, mongo:latest and create containers and install all necessary packages to run.

    ```bash
    docker-compose build
    ```

-   Run docker containers. It will take some time to start service. You can see `-d` flags in [docker-compose up](https://docs.docker.com/compose/reference/up/)

    ```sh
    docker-compose up -d
    ```

-  After finished, check service is started and see it's logs:
    ```sh
    docker-compose ps
    Log:
        Name                 Command             State             Ports           
        -------------------------------------------------------------------------------
        db             docker-entrypoint.sh mongo    Up      0.0.0.0:27017->27017/tcp  
                       ...                                                             
        ktx-backend    docker-entrypoint.sh npm      Up      3000/tcp,                 
                       start                                 0.0.0.0:4000->4000/tcp    
        ktx-frontend   docker-entrypoint.sh node     Up      0.0.0.0:9000->9000/tcp 
    ```

## Usage

- Open browser and check it at [localhost:9000](localhost:9000), another tab browser to check backend [localhost:4000](localhost:4000)

- Note that there are no database


## Import database
- In *domitory-manage/src* directory 
   - Copy the *database scripts* directory to /database, example for *data* directory:

    ```bash
       cp -r <data-path> ./database
    ```
    - Due to mapping *src/database* to *home/data* in Docker file, so you can import database with script
    ```bash
       docker-compose exec mongodb sh -c "mongorestore --db=ktx home/data/data"
    ```
- If you don't have *database scripts*, contact me at **vmtrung1997@gmail.com**
