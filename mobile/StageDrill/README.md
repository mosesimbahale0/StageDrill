# Apollo Kotlin  + Firebase Phone Auth

Repository for the [Apollo Kotlin](https://github.com/apollographql/apollo-kotlin) tutorial.


[//]: # (Rename Android Project)
chmod +x rename_android_project.sh

./rename_android_project.sh "StageDrill" "com.stagedrill.stagedrill"

 find . -name '*.kt' -type f



[//]: # (Open in android studio)
- Create a new firebase project and downlosd a nowe google-service.json file
- Use android studio to add it in /app



[//]: # (Get SHA-1 with Gradlew)
./gradlew signingReport


[//]: # (Rename the root Project Name in settings.gradle.kts IDE)
<!-- rootProject.name = "WateRefil" navigate to the settings.gradle.kts and rename for IDE to reflect -->
<!-- INTEGRATED TO THE script -->

[//]: # (Rename the Theme Using IDE)
Highlight ThemeName then select Refactor > Rename from the menu. 


[//]: # (Rename the org name)
- Change view to packages
- right click on org name and refactor/rename
- check all boxes and text, all occurances etc
- Add this statement to all files using R    import waterefil.waterefil.R



[//]: # (Clear Caches)
- Close android studio
- Open the project in vscode and delete the .idea
- Re-open the project and sync gradle