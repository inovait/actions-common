import java.io.File

val commitFile = "/home/matejd/git/internal/actions-common/git-changelog-generator/test/test-files/example-major-release.txt"

val regex = Regex("(?=(^|\\n)commit [a-f0-9]{40}(\\r)?\\n)")

val fullText = File(commitFile).readText()

val commits = regex.split(fullText)

for (commit in commits) {
    if (commit.isBlank()) {
        continue
    }

    val lines = commit.trim().split('\n')
    val sha = lines[0].trim().substring(7)
    val msg = lines[4].trim()
    val date = lines[2].substring(8)
    val description = lines.subList(5, lines.size).filter { it.isNotBlank() }.joinToString("\\n").trim()

    println("      createFakeCommit(")
    println("        '$sha',")
    println("        '$msg',")
    println("        '$date',")
    if (description.isNotBlank()) {
        println("        '$description',")
    }
    println("      ),")
}
