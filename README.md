comandos:
- npm install
- cds build
- cds watch --profile hybrid 
- cds bind -2 nombreContenedor:SharedDevKey
- cds bind -2 nombreServicio:claveServicio

importante:
- Desplegar a Hana: con el cohete que aparece en la parte de hana
- Para crear app router: click derecho en mta.yaml --> create module from template. Esto añade cosas nuevas en el package json
- Para desplegar el proyecto: click derecho en mta.yaml --> build mta proyect y despliegas luego el .mtar generado 



# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
