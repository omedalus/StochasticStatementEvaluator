# Evolvable Stochastic Sparse Random Boolean Network (ESSRBN)

I've been realizing that our take on neural networks, particularly recurrent and convoluted ones, might be worth a complete overhaul.

Instead of "backpropagation", we should be applying reinforcement to the entire synaptome at once. And instead of a top-down evaluation process per presentation of input and a static judgment of the output, we should be permitting the network to run for some number of iterations and then interpreting the output based on the _integral_ of the output nodes' activity within that evaluation period.

Imagine a set of Boolean nodes. Each node has a current True/False state. Each node also has a Boolean expression, whose terms are references to _some_ of the the other nodes. One by one, in each "round", a node is selected at random, its expression is evaluated based on the current known states of the other nodes, and its current truthiness is set to the result.

Designate a few of those nodes and inputs, and one as an output. Set the inputs to a pattern, and then sit back and watch the output.

Is the output _usually_ at the desired value? That is, within some predefined number of rounds, on a round-after-round basis, on what fraction of rounds is the output correct? That's your network's fitness.

Now, some networks are more fit than others, of course. Generate an infinite number of such networks, and run them all on the same data. Keep one that produces the highest fitness (i.e. its output node is set to the correct value the most often), throw away all the others.

You probably don't have the computing power to generate an infinite number. But you can produce _some_ number -- some _population_ of networks. Within that number, some will perform better than others, of course. Now, throwing away the low performers is easy. The question is, is there some way to generate new population members based on the remaining ones such that the new members' behavior is still similar to the old? 

Well, trivially, yes: You can literally copy an entire old network to create a new one, and then the new one will behave qualitatively similar to the old. Right?

Actually, not necessarily! Because nodes are evaluated stochastically, there's no guarantee that a network will behave the same from one run to the next, even with the same network structure. The network could theoretically have two (or more) different strange attractors. As such, the network's fitness should be gauged by its ability to produce the desired output state most of the time _on multiple runs_. But I digress.

The question is: Is each network _reducible_? Can we make small modifications to the network structure and get only small changes to the overall network behavior? That, in turn, depends on how the expressions within each node are phrased, and how we intent to perform mutations.


## Prior work

### Training neural networks using genetic algorithms

1. An excellent and brief discussion on the topic on StackOverflow. The consensus is that GAs are far more computationally expensive than backpropagation. An interesting takeaway from this discussion is that one can full train an NN using backprop, hitting the best fitness level you can reach with BP, and then use the trained NN to seed a population for a GA to squeeze a bit more performance out of the NN -- the winner of which can then be continued to be trained with BP, ad infinitum. Basically, one can use a GA to bust BP out of local minima. https://stats.stackexchange.com/questions/55887/backpropagation-vs-genetic-algorithm-for-neural-network-training
1. Another brief discussion on ResearchGate. This one suggests that a GA would be a better training algorithm than BP for problems in which you lack a one-to-one mapping from input to desired output, and thus a more complex fitness function might be more suitable. This appears to describe the condition of most autonomous agents -- agents are scored based on the overall performance of their NN being able to produce a desirable sequence of actions over a period of time (such as the agent's lifetime), so there is no single set of inputs and outputs that can provide feedback to the agent. (It's worth noting that, strictly speaking, this isn't necessarily true. The agent can keep a memo of every input-output combination that it had experienced/produced over some period of time; and, upon experiencing some kind of feedback, trains its NN on all of its logged experiences, with the rationale being that the total cohort of its actions in response to stimuli is what caused the feedback event. This is worth trying.) https://www.researchgate.net/post/How_can_train_the_ANN_by_using_GA_Genetic_Algorithm2
1. David J. Montana and Lawrence Davis. 1989. _Training feedforward neural networks using genetic algorithms._ In _Proceedings of the 11th international joint conference on Artificial intelligence - Volume 1 (IJCAI'89), Vol. 1_. Morgan Kaufmann Publishers Inc., San Francisco, CA, USA, 762-767. A very early and relatively widely-cited paper that used GAs to train NNs, and claimed to demonstrate significant performance advantage over BP. Despite being a somewhat famous paper, these results do not seem to be reflected in industry practice. My guess is that their BP was crippled with a very inefficient step size, enough to make the GA look good by comparison.

