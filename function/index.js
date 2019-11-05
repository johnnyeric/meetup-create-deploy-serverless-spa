const express = require('express');
const bodyParser = require('body-parser');
const graphql = require('graphql.js');

const app = express();

const endpoint = 'https://serene-sea-87604.herokuapp.com/v1/graphql';
const graph = graphql(endpoint, {
  asJSON: true
});

app.use(bodyParser.json());

const getCurrentPresentation = graph(`
  query {
    meetup_presentation(limit: 1, order_by: {created_at: desc}) {
      id
      topic {
        id
        title
      }
    }
  }
`);

const setTopicToVote = graph(`
  mutation update_meetup_vote($topic_id: uuid, $vote_id: uuid) {
    update_meetup_vote(_set: {topic_id: $topic_id}, where: {id: {_eq: $vote_id}}) {
      returning {
        id
      }
    }
  }
`);

async function setCurrentTopic(vote) {
  const { id } = vote;
  
  const presentationResponse = await getCurrentPresentation();
  
  if (presentationResponse.meetup_presentation.length) {
    const presentation = presentationResponse.meetup_presentation[0];
    const currentTopicId = presentation.topic.id;
    
    await setTopicToVote({ topic_id: currentTopicId, vote_id: id});
  }
}

app.post('/set-current-topic', async function (req, res) {
    try{
        const topicVote = req.body.event.data.new;
        
        await setCurrentTopic(topicVote);
  
        res.json(`Topic vote ${topicVote.id} handled`);
    } catch(e) {
        console.log(e);
        res.status(500).json(e.toString());
    }
});


app.get('/', function (req, res) {
  res.send('Hello World - For Event Triggers, try a POST request?');
});

var server = app.listen(process.env.PORT || 8080, function () {
    console.log("server listening");
});