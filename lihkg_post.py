import requests
from bs4 import BeautifulSoup

url = 'https://lihkg.com/thread/3269598/page/1'

# Send a GET request to the website
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# Find all the posts on the page
posts = soup.find_all('div', class_='c-post')

# Print the content of each post
for post in posts:
  print(post.text)