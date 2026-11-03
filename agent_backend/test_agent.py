import unittest
from agent_core import AgentInput, coordinate, signed_message, verify_message, BDIManager
class AgentTests(unittest.TestCase):
    def test_ranks_ten_startups(self):
        out=coordinate(AgentInput())
        self.assertEqual(len(out['ranked_candidates']),10)
        self.assertGreaterEqual(out['ranked_candidates'][0]['score'],out['ranked_candidates'][-1]['score'])
    def test_bdi_replans_when_budget_changes(self):
        b=BDIManager(); b.update_beliefs({'budget':'Medium'}); before=list(b.intentions)
        b.update_beliefs({'budget':'Low (< ₹50,000)'}); self.assertNotEqual(before,b.intentions)
        self.assertIn('prioritize_low_cost_mvp',b.intentions)
    def test_signed_message_and_tampering(self):
        msg=signed_message('idea-agent',{'action':'evaluate_startup'})
        self.assertTrue(verify_message(msg)[0]); msg['payload']['action']='dangerous'; self.assertFalse(verify_message(msg)[0])
    def test_consensus(self): self.assertTrue(coordinate(AgentInput())['agent_negotiation']['consensus_reached'])
if __name__=='__main__': unittest.main(verbosity=2)
