# Evolvable Stochastic Logic Evaluator (ESLE)

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


