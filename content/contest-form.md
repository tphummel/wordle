---
title: Contest Entry Form
---

{{< contestForm.inline >}}
  <form method="post" action="/new-contest-entry">
    <label for="name">Name:</label>
    <select id="name" name="name" required>
      <option value="">Please select a name</option>
      <option value="Tom">Tom</option>
      <option value="Neela">Neela</option>
      <option value="Fred">Fred</option>
      <option value="Mandy">Mandy</option>
    </select><br><br>

    <label for="result">Result:</label>
    <input type="text" id="result" name="result" required><br><br>

    <label for="word-list">Word List:</label>
    <textarea id="word-list" name="word_list" rows="10" cols="50" required></textarea><br><br>

    <label for="comments">Comments:</label>
    <textarea id="comments" name="comments" rows="5" cols="50"></textarea><br><br>

    <input type="submit" value="Submit">
  </form>
{{< /contestForm.inline >}}
