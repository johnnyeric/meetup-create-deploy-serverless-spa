const graphql = require('graphql.js');

const PRESENTATION_ID = '069523ac-193f-4808-9ac6-e54ec88372c8';
const endpoint = 'https://serene-sea-87604.herokuapp.com/v1/graphql';
const graph = graphql(endpoint, {
  asJSON: true
});

const updateTopicAndQuestion = graph(`
  mutation update_meetup_presentation($current_topic_id: uuid, $current_question_id: uuid, $id: uuid) {
    update_meetup_presentation(_set: {current_topic_id: $current_topic_id, current_question_id: $current_question_id}, where: {id: {_eq: $id}}) {
      returning {
        id
        current_topic_id
        current_question_id
        created_at
      }
    }
  }
`);

export default async (topicId, questionId) => {
  await updateTopicAndQuestion({ current_topic_id: topicId, current_question_id: questionId, id: PRESENTATION_ID });
}